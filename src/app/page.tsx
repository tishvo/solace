"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AdvocateData = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

const removeCasing = (words: string | string[]): string | string[] => {
  if (typeof words === "string") {
    return words.toLowerCase();
  }
  return words.map((word) => word.toLowerCase());
};

const formatPhoneNumber = (phoneNumberString: string): string | null => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
};

function SearchWithClear({
  onSearch,
  onClear,
  searchTerm,
}: {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  searchTerm: string;
}) {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2 pb-8">
      <Input
        type="text"
        placeholder="Search for an advocate"
        onChange={onSearch}
        value={searchTerm}
      />
      <Button type="reset" onClick={onClear} className="bg-solaceGreen">
        Clear search
      </Button>
    </div>
  );
}

export default function Home() {
  const [advocates, setAdvocates] = useState<AdvocateData[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<AdvocateData[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value.toLowerCase();
      setSearchTerm(searchTerm);

      const filteredAdvocates = advocates.filter((advocate) => {
        return (
          removeCasing(advocate.firstName).includes(searchTerm) ||
          removeCasing(advocate.lastName).includes(searchTerm) ||
          removeCasing(advocate.city).includes(searchTerm) ||
          removeCasing(advocate.degree).includes(searchTerm) ||
          advocate.specialties.find((specialty) =>
            removeCasing(specialty).includes(searchTerm)
          ) ||
          advocate.yearsOfExperience.toString().includes(searchTerm) ||
          advocate.phoneNumber.toString().includes(searchTerm)
        );
      });
      setFilteredAdvocates(filteredAdvocates);
    },
    [advocates]
  );

  const onClearSearch = useCallback(() => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  }, [advocates]);

  return (
    <>
      <header className="text-2xl font-semibold h-24 place-content-center text-solaceGreen pl-12 pt-10">
        Solace Advocates
      </header>
      <div style={{ width: "100wv", margin: 50 }}>
        <SearchWithClear
          onSearch={onSearch}
          onClear={onClearSearch}
          searchTerm={searchTerm}
        />
        <Table className="overflow-scroll border-2">
          <TableHeader className="text-lg bg-solaceGreen">
            <TableRow>
              <TableHead className="w-[100px]">First Name</TableHead>
              <TableHead className="w-[100px]">Last Name</TableHead>
              <TableHead className="w-[100px]">City</TableHead>
              <TableHead className="w-[100px]">Degree</TableHead>
              <TableHead className="w-[400px]">Specialties</TableHead>
              <TableHead className="text-center w-[150px]">
                Years of Experience
              </TableHead>
              <TableHead className="text-right w-[125px]">
                Phone Number
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-base">
            {filteredAdvocates.map((advocate, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {advocate.firstName}
                </TableCell>
                <TableCell className="font-medium">
                  {advocate.lastName}
                </TableCell>
                <TableCell>{advocate.city}</TableCell>
                <TableCell>{advocate.degree}</TableCell>
                <TableCell>
                  {advocate.specialties.map((specialty, index) => {
                    return <div key={index}>{`${"\u2022"} ${specialty}`}</div>;
                  })}
                </TableCell>
                <TableCell className="text-center">
                  {advocate.yearsOfExperience}
                </TableCell>
                <TableCell className="text-right">
                  {formatPhoneNumber(advocate.phoneNumber.toString())}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
